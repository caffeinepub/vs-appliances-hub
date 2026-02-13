import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat64 "mo:core/Nat64";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";

import Order "mo:core/Order";
import Char "mo:core/Char";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Request Management
  public type Brand = {
    #lg;
    #samsung;
    #daikin;
    #whirlpool;
    #voltas;
    #other : Text;
  };

  public type RequestType = {
    #service;
    #spares;
  };

  public type RequestStatus = {
    #open;
    #assigned;
    #enRoute;
    #pendingSpares;
    #completed;
  };

  public type Request = {
    id : Text;
    brand : Brand;
    category : Text;
    requestType : RequestType;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    location : Text; // Free-text location field
    description : Text;
    user : Principal;
    status : RequestStatus;
    assignedTechnician : ?Text;
    sparesUsed : ?Text;
    createdTime : Nat64;
    updatedTime : Nat64;
  };

  public type Technician = {
    id : Text;
    name : Text;
    phone : ?Text;
    notes : ?Text;
  };

  public type Feedback = {
    ticketId : Text;
    customerName : Text;
    technician : ?Text;
    rating : Nat; // 1-5
    comments : ?Text;
    createdTime : Nat64;
  };

  public type InventoryItem = {
    id : Text;
    name : Text;
    quantity : Nat;
    threshold : Nat;
    createdTime : Nat64;
    updatedTime : Nat64;
  };

  public type InventoryLog = {
    id : Text;
    ticketId : Text;
    technician : Text;
    itemId : Text;
    quantity : Nat;
    createdTime : Nat64;
  };

  let requests = Map.empty<Text, Request>();
  let technicians = Map.empty<Text, Technician>();
  let feedbackEntries = Map.empty<Text, Feedback>();
  let inventoryItems = Map.empty<Text, InventoryItem>();
  let inventoryLogs = Map.empty<Text, InventoryLog>();

  // Helper for brand to text conversion
  func brandToText(brand : Brand) : Text {
    switch (brand) {
      case (#lg) { "LG" };
      case (#samsung) { "Samsung" };
      case (#daikin) { "Daikin" };
      case (#whirlpool) { "Whirlpool" };
      case (#voltas) { "Voltas" };
      case (#other(text)) { text };
    };
  };

  // Helper functions for case-insensitive search
  func toLowerAscii(text : Text) : Text {
    let chars = text.toArray();
    let lowerChars = chars.map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } });
    Text.fromArray(lowerChars);
  };

  func containsIgnoreCase(haystack : Text, needle : Text) : Bool {
    let haystackLower = toLowerAscii(haystack);
    let needleLower = toLowerAscii(needle);
    haystackLower.contains(#text(needleLower));
  };

  public shared ({ caller }) func createRequest(
    id : Text,
    brand : Brand,
    category : Text,
    requestType : RequestType,
    customerName : Text,
    phoneNumber : Text,
    address : Text,
    location : Text,
    description : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in with Internet Identity");
    };

    let currentTime = Nat64.fromIntWrap(Time.now());

    let request : Request = {
      id;
      brand;
      category;
      requestType;
      customerName;
      phoneNumber;
      address;
      location;
      description;
      user = caller;
      status = #open;
      assignedTechnician = null;
      sparesUsed = null;
      createdTime = currentTime;
      updatedTime = currentTime;
    };
    requests.add(id, request);
  };

  // Public Track Status API - intentionally public for customer tracking
  public query ({ caller }) func trackStatusById(id : Text) : async ?Request {
    requests.get(id);
  };

  public query ({ caller }) func trackStatusByIdAndPhone(id : Text, phone : Text) : async ?Request {
    switch (requests.get(id)) {
      case (null) { null };
      case (?request) {
        if (request.phoneNumber == phone) {
          ?request;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getRequestById(id : Text) : async ?Request {
    switch (requests.get(id)) {
      case (null) { null };
      case (?request) {
        // Only allow access if caller owns the request or is an admin
        if (caller != request.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own requests");
        };
        ?request;
      };
    };
  };

  public query ({ caller }) func getRequestsByCaller() : async [Request] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in with Internet Identity");
    };

    requests.values().filter(
      func(r) {
        r.user == caller;
      }
    ).toArray();
  };

  // Extended Filtering API - admin-only or filtered by ownership
  public query ({ caller }) func getFilteredRequests(
    search : ?Text,
    brandFilter : ?Brand,
    locationFilter : ?Text,
    statusFilter : ?RequestStatus,
  ) : async [Request] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isUser = AccessControl.hasPermission(accessControlState, caller, #user);

    if (not isUser) {
      Runtime.trap("Unauthorized: Please log in with Internet Identity");
    };

    let results = requests.values().toArray().filter(
      func(r) {
        // Non-admins can only see their own requests
        let ownershipMatch = isAdmin or r.user == caller;

        let searchMatch = switch (search) {
          case (?s) {
            containsIgnoreCase(r.id, s) or
            containsIgnoreCase(r.customerName, s) or
            containsIgnoreCase(r.phoneNumber, s) or
            containsIgnoreCase(r.description, s) or
            containsIgnoreCase(r.address, s) or
            containsIgnoreCase(r.category, s);
          };
          case (null) { true };
        };

        let brandMatch = switch (brandFilter) {
          case (?b) { r.brand == b };
          case (null) { true };
        };

        let locationMatch = switch (locationFilter) {
          case (?loc) { containsIgnoreCase(r.location, loc) };
          case (null) { true };
        };

        let statusMatch = switch (statusFilter) {
          case (?s) { r.status == s };
          case (null) { true };
        };

        ownershipMatch and searchMatch and brandMatch and locationMatch and statusMatch;
      }
    );

    results;
  };

  // Technician Management
  public shared ({ caller }) func addTechnician(id : Text, name : Text, phone : ?Text, notes : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    let technician : Technician = {
      id;
      name;
      phone;
      notes;
    };
    technicians.add(id, technician);
  };

  public query ({ caller }) func getAllTechnicians() : async [Technician] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    technicians.values().toArray();
  };

  public shared ({ caller }) func assignTechnician(id : Text, technicianId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    let technicianName = switch (technicians.get(technicianId)) {
      case (null) { technicianId }; // Fallback to free-text
      case (?tech) { tech.name };
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest : Request = {
          request with
          assignedTechnician = ?technicianName;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        requests.add(id, updatedRequest);
      };
    };
  };

  // Feedback Management
  public shared ({ caller }) func submitFeedback(
    ticketId : Text,
    customerName : Text,
    technician : ?Text,
    rating : Nat,
    comments : ?Text,
  ) : async () {
    // Verify the ticket exists and caller has access to it
    switch (requests.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?request) {
        // Allow ticket owner or admin to submit feedback
        if (caller != request.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only submit feedback for your own tickets");
        };

        let feedback : Feedback = {
          ticketId;
          customerName;
          technician;
          rating;
          comments;
          createdTime = Nat64.fromIntWrap(Time.now());
        };
        feedbackEntries.add(ticketId, feedback);
      };
    };
  };

  public query ({ caller }) func getFeedbackByTechnician(technician : ?Text) : async [Feedback] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (technician) {
      case (null) { feedbackEntries.values().toArray() };
      case (?tech) {
        feedbackEntries.values().filter(
          func(f) {
            switch (f.technician) {
              case (null) { false };
              case (?t) { t == tech };
            };
          }
        ).toArray();
      };
    };
  };

  public query ({ caller }) func getTechnicianPerformance() : async [(Text, Nat, Nat)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    let technicianFeedbackMap = Map.empty<Text, (Nat, Nat)>();

    for (feedback in feedbackEntries.values()) {
      switch (feedback.technician) {
        case (null) {};
        case (?technician) {
          let (total, count) = switch (technicianFeedbackMap.get(technician)) {
            case (null) { (feedback.rating, 1) };
            case (?current) {
              let (t, c) = current;
              (t + feedback.rating, c + 1);
            };
          };
          technicianFeedbackMap.add(technician, (total, count));
        };
      };
    };

    let results = technicianFeedbackMap.toArray().map(
      func(tuple) {
        let (text, (total, count)) = tuple;
        (text, total, count);
      }
    );

    results.sort(
      func(a, b) {
        let (_, _, countA) = a;
        let (_, _, countB) = b;
        if (countA > countB) { #less } else if (countA < countB) { #greater } else {
          #equal;
        };
      }
    );
  };

  // Inventory Management
  public shared ({ caller }) func addInventoryItem(id : Text, name : Text, quantity : Nat, threshold : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    let currentTime = Nat64.fromIntWrap(Time.now());

    let item : InventoryItem = {
      id;
      name;
      quantity;
      threshold;
      createdTime = currentTime;
      updatedTime = currentTime;
    };
    inventoryItems.add(id, item);
  };

  public shared ({ caller }) func updateInventoryItem(id : Text, quantity : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (inventoryItems.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        let updatedItem : InventoryItem = {
          item with
          quantity;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        inventoryItems.add(id, updatedItem);
      };
    };
  };

  public query ({ caller }) func getInventoryItems() : async [InventoryItem] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    inventoryItems.values().toArray();
  };

  public query ({ caller }) func getLowStockItems() : async [InventoryItem] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    inventoryItems.values().filter(
      func(item) {
        item.quantity <= item.threshold;
      }
    ).toArray();
  };

  public shared ({ caller }) func addInventoryLog(
    ticketId : Text,
    technician : Text,
    itemId : Text,
    quantity : Nat,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (inventoryItems.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        if (item.quantity < quantity) {
          Runtime.trap("Insufficient inventory");
        };

        let log : InventoryLog = {
          id = ticketId # "-" # itemId;
          ticketId;
          technician;
          itemId;
          quantity;
          createdTime = Nat64.fromIntWrap(Time.now());
        };
        inventoryLogs.add(log.id, log);

        let updatedItem : InventoryItem = {
          item with
          quantity = item.quantity - quantity;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        inventoryItems.add(itemId, updatedItem);
      };
    };
  };

  public query ({ caller }) func getInventoryLogs() : async [InventoryLog] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    inventoryLogs.values().toArray();
  };
};

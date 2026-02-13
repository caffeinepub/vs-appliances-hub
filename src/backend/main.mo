import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat64 "mo:core/Nat64";
import Time "mo:core/Time";



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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Request Management
  public type RequestType = {
    #service;
    #spares;
  };

  public type RequestStatus = {
    #open;
    #closed;
  };

  public type Request = {
    id : Text;
    category : Text;
    requestType : RequestType;
    customerName : Text;
    phoneNumber : Text;
    address : Text;
    description : Text;
    user : Principal;
    status : RequestStatus;
    assignedTechnician : ?Text;
    sparesUsed : ?Text;
    createdTime : Nat64;
    updatedTime : Nat64;
  };

  let requests = Map.empty<Text, Request>();

  public shared ({ caller }) func createRequest(
    id : Text,
    category : Text,
    requestType : RequestType,
    customerName : Text,
    phoneNumber : Text,
    address : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please log in with Internet Identity");
    };

    let currentTime = Nat64.fromIntWrap(Time.now());

    let request : Request = {
      id;
      category;
      requestType;
      customerName;
      phoneNumber;
      address;
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please log in with Internet Identity");
    };

    requests.values().filter(
      func(r) {
        r.user == caller;
      }
    ).toArray();
  };

  // Admin APIs
  public query ({ caller }) func getAllRequests() : async [Request] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    requests.values().toArray();
  };

  public shared ({ caller }) func updateRequestStatus(id : Text, status : RequestStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest : Request = {
          request with
          status;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        requests.add(id, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func assignTechnician(id : Text, technician : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest : Request = {
          request with
          assignedTechnician = ?technician;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        requests.add(id, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func updateSparesUsed(id : Text, spares : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest : Request = {
          request with
          sparesUsed = ?spares;
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        requests.add(id, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func adminUpdateRequest(
    id : Text,
    status : ?RequestStatus,
    technician : ?Text,
    spares : ?Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest : Request = {
          request with
          status = switch (status) {
            case (?newStatus) { newStatus };
            case (null) { request.status };
          };
          assignedTechnician = switch (technician) {
            case (?newTechnician) { ?newTechnician };
            case (null) { request.assignedTechnician };
          };
          sparesUsed = switch (spares) {
            case (?newSpares) { ?newSpares };
            case (null) { request.sparesUsed };
          };
          updatedTime = Nat64.fromIntWrap(Time.now());
        };
        requests.add(id, updatedRequest);
      };
    };
  };
};

import { useGetAllTechnicians } from '../../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface TechnicianSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function TechnicianSelect({ value, onChange, label = 'Technician' }: TechnicianSelectProps) {
  const { data: technicians, isLoading } = useGetAllTechnicians();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Loading...' : 'Select technician'} />
        </SelectTrigger>
        <SelectContent>
          {technicians?.map((tech) => (
            <SelectItem key={tech.id} value={tech.id}>
              {tech.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

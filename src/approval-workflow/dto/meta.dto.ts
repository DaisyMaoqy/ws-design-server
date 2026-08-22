export interface FieldRule {
  key: string;
  label?: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'date'
    | 'dateRange'
    | 'repeatable'
    | 'group';
  required: boolean;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  noteThresholdCents?: number;
}

export interface MetaResponse {
  type: 'travel' | 'leave';
  fields: FieldRule[];
  maxLegs: number;
  centsMax: number;
}

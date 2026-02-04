type userLabel = {
  text: string;
};

export type UserFormInstance = {
  validateAll?: () => Promise<{ valid: boolean }>;
} | null;

export interface UserFormInterface {
  id: number;
  label: userLabel[];
  typeRecord: string;
  login: string;
  password: string;
}

export interface updatedFieldInterface {
  id: number;
  filed: string;
  value: string | userLabel[];
}

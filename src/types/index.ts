export type User = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

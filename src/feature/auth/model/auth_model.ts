export interface AuthUser extends Omit<UserTokenPayload, 'exp'> {
  uuid: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenPayload {
  sub: string;
  email: string;
  imageUrl: string;
  role: string;
  type: string;
  aud: string;
  iss: string;
  exp: number;
}

export interface RegisterInputs {
  email            :string,
  password         :string,
  fullName         :string,
  rfc              :string,
  curp             :string,
  birthDate        :Date,
  profileImageUrl? :File,
  address          :Address,
  role             :Role,
}

export interface Address{
  id?             :string,
  street          :string,
  internalNumber? :string,
  externalNumber  :string,
  neighborhood    :string,
  locality        :string,
  municipality    :string,
  state           :string,
  zipCode         :string,
  country         :string,
}

export interface Role {
  name        :string,
  description? :string,
}

export interface LoginInputs {
  email: string;
  password: string;
}
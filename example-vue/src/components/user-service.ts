export interface User {
  firstName: string;
  lastName: string;
}

export const fetchUser = async (id: number): Promise<User> => await fetch(`/user/${id}`).then(res => res.json());
export const fetchUsers = async (): Promise<User> => await fetch(`/users`).then(res => res.json());

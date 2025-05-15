// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { mockPoints } from '../modules/map/mockPoints';
import { Point } from '../types/points';

interface Role {
  role_id: string;
  rools: string;
}

interface User {
  user_id: string;
  email: string;
  role_id: string;
  createdAt: string;
  createdBy: string;
}

const mockRoles: Role[] = [
  { role_id: "role1", rools: "guest" },
  { role_id: "role2", rools: "moderator" },
  { role_id: "role3", rools: "admin" },
];

const mockUsers: User[] = [
  {
    user_id: "user1",
    email: "guest@example.com",
    role_id: "role1",
    createdAt: "2024-05-08T10:00:00",
    createdBy: "admin",
  },
  {
    user_id: "user2",
    email: "moderator@example.com",
    role_id: "role2",
    createdAt: "2024-05-08T10:00:00",
    createdBy: "admin",
  },
  {
    user_id: "user3",
    email: "admin@example.com",
    role_id: "role3",
    createdAt: "2024-05-08T10:00:00",
    createdBy: "system",
  },
];

export const fetchUsers = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { users: mockUsers, roles: mockRoles };
  } catch (e) {
    console.error('Error fetching users:', e);
    return { users: [], roles: [] };
  }
};

export const updateUserRole = async (userId: string, newRoleId: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = mockUsers.find((u) => u.user_id === userId);
    if (user) {
      user.role_id = newRoleId;
      user.createdAt = new Date().toISOString();
      user.createdBy = "admin";
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating user role:', e);
    return false;
  }
};

export const fetchPoints = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { points: mockPoints };
  } catch (e) {
    console.error('Error fetching points:', e);
    return { points: [] };
  }
};

export const createPoint = async (point: Omit<Point, 'point_id'>) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPoint: Point = {
      point_id: `point${mockPoints.length + 1}`,
      user_id: point.user_id,
      x: point.x,
      y: point.y,
      z: point.z,
    };
    mockPoints.push(newPoint);
    return newPoint.point_id;
  } catch (e) {
    console.error('Error creating point:', e);
    return null;
  }
};

export const updatePoint = async (pointId: string, updatedPoint: Partial<Point>) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const point = mockPoints.find((p) => p.point_id === pointId);
    if (point) {
      Object.assign(point, updatedPoint);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating point:', e);
    return false;
  }
};
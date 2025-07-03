import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import AddEditUserModal from './AddEditUserModal';
import DeleteUserModal from './DeleteUserModal';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from './DashboardLayout'; // ✅ Make sure path is correct

const UserManagementContent = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@100acres.com',
      phone: '+91 9876543210',
      role: 'head-admin',
      department: 'Sales',
      status: 'active',
      lastLogin: '2024-01-15',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@100acres.com',
      phone: '+91 9876543211',
      role: 'team-leader',
      department: 'Marketing',
      status: 'active',
      lastLogin: '2024-01-14',
      createdAt: '2024-01-02'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@100acres.com',
      phone: '+91 9876543212',
      role: 'employee',
      department: 'Sales',
      status: 'inactive',
      lastLogin: '2024-01-10',
      createdAt: '2024-01-03'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@100acres.com',
      phone: '+91 9876543213',
      role: 'employee',
      department: 'Customer Support',
      status: 'active',
      lastLogin: '2024-01-15',
      createdAt: '2024-01-04'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { toast } = useToast();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin';
      case 'head-admin': return 'Head Admin';
      case 'team-leader': return 'Team Leader';
      case 'employee': return 'Employee';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role) => {
    return {
      'super-admin': 'bg-purple-100 text-purple-800',
      'head-admin': 'bg-blue-100 text-blue-800',
      'team-leader': 'bg-green-100 text-green-800',
      'employee': 'bg-gray-100 text-gray-800',
    }[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast({
          title: "Status Updated",
          description: `${user.name} is now ${newStatus}`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(users.map(user =>
        user.id === selectedUser.id ? { ...userData, id: selectedUser.id } : user
      ));
      toast({ title: "User Updated", description: `${userData.name} updated successfully` });
    } else {
      setUsers([...users, { ...userData, id: Date.now() }]);
      toast({ title: "User Created", description: `${userData.name} added to the system` });
    }
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user.name} has been removed`,
      variant: "destructive"
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
<Card>
  <CardContent className="p-6">
    <div className="flex items-center gap-4 overflow-x-auto">
      {/* Search Input */}
      <div className="relative w-[350px]">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="      Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Role Filter */}
      <div className="w-[200px]">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Roles</option>
          <option value="super-admin">Super Admin</option>
          <option value="head-admin">Head Admin</option>
          <option value="team-leader">Team Leader</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-[200px]">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  </CardContent>
</Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Users ({filteredUsers.length})</span>
            <span className="text-sm text-gray-500">{users.filter(u => u.status === 'active').length} active</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                    <TableCell className="text-sm text-gray-500">{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)} className="h-8 w-8 p-0">
                          {user.status === 'active' ? <UserX className="h-4 w-4 text-red-600" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEditUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveUser}
      />

      <AddEditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={() => handleDeleteUser(selectedUser?.id)}
      />
    </div>
  );
};

// Final Export wrapped with Dashboard Layout
const UserManagement = () => {
  return (
    <DashboardLayout>
      <UserManagementContent />
    </DashboardLayout>
  );
};

export default UserManagement;

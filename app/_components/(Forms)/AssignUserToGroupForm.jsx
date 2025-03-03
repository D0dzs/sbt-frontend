'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { wait } from '~/lib/utils';

const AssignUserToGroupForm = ({ users, groups, refresh, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    username: '',
    groupname: '',
    rolename: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.API_URL}/group/assign-position`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(formState),
    });

    if (!response.ok) {
      const ctx = await response.json();
      toast.error(ctx.message);
      return;
    } else {
      const ctx = await response.json();
      toast.success(ctx.message);
      wait().then(() => {
        setRefresh(!refresh);
        setOpen(false);
      });
    }
  };

  useEffect(() => {
    if (!open) {
      setFormState({
        username: '',
        groupname: '',
        rolename: '',
      });
    }
  }, [open]);

  const writeData = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUserChange = (value) => {
    setFormState({ username: value, groupname: '', rolename: '' });
  };

  const handleGroupChange = (value) => {
    setFormState({ ...formState, groupname: value, rolename: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Tag hozzáadása (csoport)</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'lg:text-2xl'}>Tag hozzáadása</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label htmlFor="user" className="mb-1 block text-sm lg:text-base">
              Felhasználó
            </label>
            <Select onValueChange={handleUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tag kiválasztása" />
              </SelectTrigger>
              <SelectContent>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <SelectItem
                      value={`${user.firstName} ${user.lastName}`}
                      key={idx}
                      className="cursor-pointer lg:not-hover:opacity-50 lg:hover:opacity-100"
                    >
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="No users found" key="no-users" disabled>
                    No users found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label htmlFor="groupname" className="mb-1 block text-sm lg:text-base">
              Csoport
            </label>
            <Select onValueChange={handleGroupChange} disabled={!formState.username}>
              <SelectTrigger>
                <SelectValue placeholder="Csoport kiválasztása" />
              </SelectTrigger>
              <SelectContent>
                {groups.length > 0 ? (
                  groups.map((group, idx) => (
                    <SelectItem
                      value={group.name}
                      key={idx}
                      className="cursor-pointer lg:not-hover:opacity-50 lg:hover:opacity-100"
                    >
                      {group.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="No groups found" key="no-groups" disabled>
                    No groups found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label htmlFor="rolename" className="mb-1 block text-sm lg:text-base">
              Szerepkör
            </label>
            <Input onChange={writeData} id="rolename" disabled={!formState.groupname} required />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={(e) => handleSubmit(e)}
            disabled={!formState.username || !formState.groupname || !formState.rolename}
          >
            Hozzáadás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignUserToGroupForm;

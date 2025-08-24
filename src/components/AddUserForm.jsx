// src/components/AddUserForm.jsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// We'll pass a function to this component to handle the form submission
export function AddUserForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job_role: '',
    specialization: '',
    city: '',
    company_name: '',
    profile_summary: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="job_role" className="text-right">Job Role</Label>
        <Input id="job_role" value={formData.job_role} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="specialization" className="text-right">Specialization</Label>
        <Input id="specialization" value={formData.specialization} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">City</Label>
        <Input id="city" value={formData.city} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="company_name" className="text-right">Company</Label>
        <Input id="company_name" value={formData.company_name} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="profile_summary" className="text-right">Summary</Label>
        <Textarea id="profile_summary" value={formData.profile_summary} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Create User</Button>
      </div>
    </form>
  );
}
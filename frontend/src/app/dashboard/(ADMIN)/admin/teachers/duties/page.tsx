import React from 'react'
import TeacherAssignmentForm from '@/components/Teachers/TeacherAssignment';
import FormElements from '@/components/FormElements';
import { FaceIcon, ImageIcon, SunIcon } from "@radix-ui/react-icons";

function assignDutiesPage() {
  return (
    <div>
     
      <h1 className="text-2xl font-bold mb-4">Assign Duties to Teachers</h1>
      
      
      <FormElements/>
      
    </div>
  );
}

export default assignDutiesPage
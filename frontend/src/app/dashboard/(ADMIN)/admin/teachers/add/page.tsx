import React from "react";
import AddTeacher from "@/components/Teachers/AddTeacher";
import AddForm from "@/components/ModalDialogs/AddForm";

function teacherAddPage() {
    return <div>
      <AddForm
        role={"teacher"}
      />
  </div>;
}

export default teacherAddPage;

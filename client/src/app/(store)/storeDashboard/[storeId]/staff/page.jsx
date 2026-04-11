"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { StoreStaffProvider } from "@/features/StoreStaff/context/StoreStaffContext";
import EmployeeList from "@/features/StoreStaff/components/EmployeeList";
import InviteEmployeeModal from "@/features/StoreStaff/components/InviteEmployeeModal";
import RoleEditorModal from "@/features/StoreStaff/components/RoleEditorModal";
import RoleList from "@/features/StoreStaff/components/RoleList";

const TAB_STYLE = (active) => ({
  padding: "10px 24px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
  background: "none",
  borderBottom: active ? "2.5px solid #4f46e5" : "2.5px solid transparent",
  color: active ? "#4f46e5" : "#6b7280",
  transition: "all 0.2s",
});

const StaffPageContent = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "5px 5px",
        fontFamily: "Inter, sans-serif",
        borderRadius: "20px",
        margin: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          borderRadius: "40px",
          background: "white",
          padding: "32px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111" }}
          >
            🛡️ Staff & Permissions
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
            Manage your store team — invite employees, create roles, and control
            access.
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 28,
          }}
        >
          <button
            style={TAB_STYLE(activeTab === "employees")}
            onClick={() => setActiveTab("employees")}
          >
            👥 Employees
          </button>
          <button
            style={TAB_STYLE(activeTab === "roles")}
            onClick={() => setActiveTab("roles")}
          >
            🔐 Roles & Permissions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "employees" ? (
          <EmployeeList onInvite={() => setInviteOpen(true)} />
        ) : (
          <RoleList onCreateRole={() => setRoleEditorOpen(true)} />
        )}

        {/* Modals */}
        <InviteEmployeeModal
          isOpen={inviteOpen}
          onClose={() => setInviteOpen(false)}
        />
        <RoleEditorModal
          isOpen={roleEditorOpen}
          onClose={() => setRoleEditorOpen(false)}
        />
      </div>
    </div>
  );
};

const StaffPage = () => {
  const params = useParams();
  return (
    <StoreStaffProvider storeId={params.storeId}>
      <StaffPageContent />
    </StoreStaffProvider>
  );
};

export default StaffPage;

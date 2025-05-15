// components/AccountButton.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const AccountButton = () => {
  return (
    <Button asChild variant="ghost" size="icon" aria-label="Cuenta" title="Cuenta">
      <Link href="/account" className="flex items-center">
        <User className="h-6 w-6 stroke-current" />
      </Link>
    </Button>
  );
}

export default AccountButton;
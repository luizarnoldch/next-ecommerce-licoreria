// components/SearchInput.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Asumiendo componente input de ShadCN
import { Button } from "@/components/ui/button";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?name=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-48 sm:w-64 md:w-80"
        aria-label="Buscar productos"
      />
      <Button type="submit" className="hidden sm:inline-flex">
        Buscar
      </Button>
    </form>
  );
};

export default SearchInput;
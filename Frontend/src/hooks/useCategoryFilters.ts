import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useCategoryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >((searchParams.get("status") as "all" | "active" | "inactive") || "all");
  const [creatorFilter, setCreatorFilter] = useState<string>(
    searchParams.get("creator") || ""
  );
  const [dateFrom, setDateFrom] = useState<string>(
    searchParams.get("dateFrom") || ""
  );
  const [dateTo, setDateTo] = useState<string>(
    searchParams.get("dateTo") || ""
  );
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );

  const updateFilters = (
    newFilters: Partial<{
      status: string;
      creator: string;
      dateFrom: string;
      dateTo: string;
      search: string;
      page: string;
    }>
  ) => {
    const current = Object.fromEntries(searchParams);
    const updated = { ...current, ...newFilters };
    setSearchParams(updated);
  };

  useEffect(() => {
    const status = searchParams.get("status") || "all";
    setStatusFilter(status as "all" | "active" | "inactive");
    const creator = searchParams.get("creator") || "";
    setCreatorFilter(creator);
    const dateFromVal = searchParams.get("dateFrom") || "";
    setDateFrom(dateFromVal);
    const dateToVal = searchParams.get("dateTo") || "";
    setDateTo(dateToVal);
    const searchQuery = searchParams.get("search") || "";
    setSearch(searchQuery);
  }, [searchParams]);

  const handleStatusFilterChange = (v: string) => updateFilters({ status: v });
  const handleCreatorFilterChange = (v: string) =>
    updateFilters({ creator: v });
  const handleDateFromChange = (v: string) => updateFilters({ dateFrom: v });
  const handleDateToChange = (v: string) => updateFilters({ dateTo: v });
  const handleSearchChange = (v: string) => updateFilters({ search: v });
  const resetFilters = () => {
    setSearchParams({});
  };

  return {
    statusFilter,
    creatorFilter,
    dateFrom,
    dateTo,
    search,
    handleStatusFilterChange,
    handleCreatorFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  };
}

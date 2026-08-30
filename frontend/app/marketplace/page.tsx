"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useListings } from "@/app/hooks/useListings";
import { ListingCard } from "@/app/components/marketplace/ListingCard";
import { ListingCardSkeleton } from "@/app/components/ui/Skeleton";
import { Button } from "@/app/components/ui/Button";
import { Search, SlidersHorizontal, PlusCircle, Layers, Grid, List, Sparkles } from "lucide-react";

export default function MarketplacePage() {
  const { data: listings, isLoading } = useListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAsset, setSelectedAsset] = useState<string>("All");
  const [milestoneOnly, setMilestoneOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", "Development", "Design", "Consulting", "Marketing", "Digital Asset"];

  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings
      .filter((listing) => {
        const matchesSearch =
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.seller.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" || listing.category === selectedCategory;

        const matchesAsset =
          selectedAsset === "All" || listing.assetSymbol === selectedAsset;

        const matchesMilestone =
          !milestoneOnly ||
          (listing.milestoneConfig && listing.milestoneConfig.percentages.length > 0);

        return matchesSearch && matchesCategory && matchesAsset && matchesMilestone;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
        return b.createdAt - a.createdAt;
      });
  }, [listings, searchQuery, selectedCategory, selectedAsset, milestoneOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soroban Testnet Escrow Marketplace</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Verified Escrow Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse services and digital products backed by trustless bilateral smart contracts.
          </p>
        </div>

        <Link href="/create">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or seller address..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Asset Selector */}
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Assets</option>
            <option value="XLM">XLM Only</option>
            <option value="USDC">USDC Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Milestone Toggle */}
          <button
            onClick={() => setMilestoneOnly(!milestoneOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
              milestoneOnly
                ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Milestones Only</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Listings Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query, clearing filters, or create a brand new listing.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedAsset("All");
              setMilestoneOnly(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

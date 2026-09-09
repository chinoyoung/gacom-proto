"use client";

import { useState } from "react";
import { AD_TYPES } from "./ad-types";
import type { CreateAdState, PlacementDim, PreviewDevice } from "./types";

export const TITLE_MAX = 85 as const;
export const DESCRIPTION_MAX = 300 as const;

const PLACEMENT_DIM_KEYS: Record<PlacementDim, "locations" | "timings" | "types"> = {
  location: "locations",
  timing: "timings",
  type: "types",
};

const INITIAL_STATE: CreateAdState = {
  adType: AD_TYPES[0].name,
  startDate: "2026-07-17",
  endDate: "2026-08-15",
  locations: [],
  timings: [],
  types: [],
  title: "",
  description: "",
  clientLink: "",
  videoLink: "",
  featuredProgram: "",
  customizeClientLink: false,
  previewDevice: "desktop",
  uploadedFileName: null,
  uploadedPreviewUrl: null,
  profileBannerDismissed: false,
};

export default function useCreateAdForm() {
  const [state, setState] = useState<CreateAdState>(INITIAL_STATE);

  function setAdType(v: string) {
    setState((s) => ({ ...s, adType: v }));
  }

  function setStartDate(v: string) {
    setState((s) => ({ ...s, startDate: v }));
  }

  function setEndDate(v: string) {
    setState((s) => ({ ...s, endDate: v }));
  }

  function addPlacementTag(dim: PlacementDim, value: string) {
    const key = PLACEMENT_DIM_KEYS[dim];
    setState((s) => ({ ...s, [key]: [value] }));
  }

  function removePlacementTag(dim: PlacementDim, value: string) {
    const key = PLACEMENT_DIM_KEYS[dim];
    setState((s) => ({ ...s, [key]: s[key].filter((v) => v !== value) }));
  }

  function setTitle(v: string) {
    setState((s) => ({ ...s, title: v.slice(0, TITLE_MAX) }));
  }

  function setDescription(v: string) {
    setState((s) => ({ ...s, description: v.slice(0, DESCRIPTION_MAX) }));
  }

  function setClientLink(v: string) {
    setState((s) => ({ ...s, clientLink: v }));
  }

  function setVideoLink(v: string) {
    setState((s) => ({ ...s, videoLink: v }));
  }

  function setFeaturedProgram(v: string) {
    setState((s) => ({ ...s, featuredProgram: v }));
  }

  function setCustomizeClientLink(v: boolean) {
    setState((s) => ({ ...s, customizeClientLink: v }));
  }

  function setPreviewDevice(v: PreviewDevice) {
    setState((s) => ({ ...s, previewDevice: v }));
  }

  function setUploadedFile(file: File | null) {
    if (!file) {
      setState((s) => ({ ...s, uploadedFileName: null, uploadedPreviewUrl: null }));
      return;
    }
    const uploadedPreviewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    setState((s) => ({ ...s, uploadedFileName: file.name, uploadedPreviewUrl }));
  }

  function dismissProfileBanner() {
    setState((s) => ({ ...s, profileBannerDismissed: true }));
  }

  function resetPlacementFields() {
    setState((s) => ({
      ...s,
      locations: [],
      timings: [],
      types: [],
      title: "",
      description: "",
      clientLink: "",
      videoLink: "",
      featuredProgram: "",
      customizeClientLink: false,
      uploadedFileName: null,
      uploadedPreviewUrl: null,
    }));
  }

  const placementCount = state.locations.length + state.timings.length + state.types.length;

  return {
    state,
    setAdType,
    setStartDate,
    setEndDate,
    addPlacementTag,
    removePlacementTag,
    placementCount,
    setTitle,
    setDescription,
    setClientLink,
    setVideoLink,
    setFeaturedProgram,
    setCustomizeClientLink,
    setPreviewDevice,
    setUploadedFile,
    dismissProfileBanner,
    resetPlacementFields,
    titleLength: state.title.length,
    TITLE_MAX,
    descriptionLength: state.description.length,
    DESCRIPTION_MAX,
  };
}

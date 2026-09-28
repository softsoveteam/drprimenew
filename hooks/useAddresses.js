"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import toast from "react-hot-toast";

export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => addressService.list(),
    enabled,
  });
}

export function useAddressMutations() {
  const queryClient = useQueryClient();

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["user-addresses"] });

  const createAddress = useMutation({
    mutationFn: addressService.create,
    onSuccess: () => {
      toast.success("Address saved");
      refresh();
    },
    onError: (err) => toast.error(err?.message || "Could not save address"),
  });

  const updateAddress = useMutation({
    mutationFn: ({ id, payload }) => addressService.update(id, payload),
    onSuccess: () => {
      toast.success("Address updated");
      refresh();
    },
    onError: (err) => toast.error(err?.message || "Could not update address"),
  });

  const setDefault = useMutation({
    mutationFn: addressService.setDefault,
    onSuccess: () => {
      toast.success("Default address updated");
      refresh();
    },
    onError: (err) => toast.error(err?.message || "Could not set default"),
  });

  const removeAddress = useMutation({
    mutationFn: addressService.remove,
    onSuccess: () => {
      toast.success("Address removed");
      refresh();
    },
    onError: (err) => toast.error(err?.message || "Could not delete address"),
  });

  return { createAddress, updateAddress, setDefault, removeAddress };
}

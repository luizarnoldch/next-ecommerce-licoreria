"use server";
import { mercadopago } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import type { Items } from "mercadopago/dist/clients/commonTypes";
import type {
  PreferenceRequest,
  PreferenceResponse,
} from "mercadopago/dist/clients/preference/commonTypes";
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";

export async function createPreference(items: Items[]) {
  const preference: PreferenceRequest = {
    items,
    back_urls: {
      success: "http://localhost:3000/success",
      failure: "http://localhost:3000/failure",
      pending: "http://localhost:3000/pending",
    },
    payment_methods: {
      excluded_payment_types: [], // No excluyas ningún tipo de pago
    },
    // auto_return: "approved",
  };

  const createRequest: PreferenceCreateData = {
    body: preference,
  };

  try {
    const preferenceClient = new Preference(mercadopago);
    const response = await preferenceClient.create(createRequest);
    return response.init_point;
  } catch (error) {
    console.error("Error creating Mercado Pago preference:", error);
    throw error;
  }
}

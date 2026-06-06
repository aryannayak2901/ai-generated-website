import type { GlobalConfig } from "payload";

export const GA4Settings: GlobalConfig = {
  slug: "ga4",
  label: "GA4 Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true, // Accessible by everyone so storefront can fetch measurement ID
    update: ({ req }) => req.user ? true : false, // Updates allowed only by logged-in admin users
  },
  fields: [
    // {
    //   name: "dashboard",
    //   type: "ui",
    //   admin: {
    //     components: {
    //       Field: "@/components/payload/GA4Dashboard#GA4Dashboard",
    //     },
    //   },
    // },
    {
      type: "row",
      fields: [
        {
          name: "measurementId",
          type: "text",
          label: "GA4 Measurement ID (G-XXXXXXXXXX)",
          admin: {
            width: "50%",
          },
        },
        {
          name: "propertyId",
          type: "text",
          label: "GA4 Property ID",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "clientEmail",
          type: "text",
          label: "Google Service Account Client Email",
          admin: {
            width: "100%",
          },
        },
      ],
    },
    {
      name: "privateKey",
      type: "textarea",
      label: "Google Service Account Private Key",
    },
  ],
};

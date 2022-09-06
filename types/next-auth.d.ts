import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string?;
            is_staff: boolean;
            is_superuser: boolean;
            stripe_customer_id: string?;
            billing_line_1: string?;
            billing_line_2: string?;
            country: string?;
            city: string?;
            state: string?;
            postal_code: string?;
            payment_method_id: string?;
        }
    }
}
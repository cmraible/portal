
import Stripe from 'stripe';
import { Price, Product } from '../../types';
import { toDateTime } from '../helpers';
import prisma from '../prisma';
import { stripe } from './stripe';

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  try {
    const newProduct = await prisma.product.upsert({
        where: { id: product.id },
        update: productData,
        create: productData
    })
  } catch (e) {
    throw e
  }
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const product_id = typeof price.product === 'string' ? price.product : price.product.id;
  const priceData = {
    id: price.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata
  };

  try {
    const newProduct = await prisma.price.upsert({
        where: { id: price.id },
        update: {product: { connect: { id: product_id }}, ...priceData},
        create: {product: { connect: { id: product_id }}, ...priceData}
    })
  } catch (e) {
    throw e
  }
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {id: uuid}
  })
  if (user.stripe_customer_id === null) {
    // No customer record found, let's create one.
    const customerData: { metadata: { user_id: string }; email?: string } =
      {
        metadata: {
          user_id: user.id
        }
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        stripe_customer_id: customer.id
      }
    })
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  if (user.stripe_customer_id.length > 1) return user.stripe_customer_id;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const user = await prisma.user.findUnique({where: { stripe_customer_id: customerId }})

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    id: subscription.id,
    user_id: user.id,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    current_period_start: toDateTime(subscription.current_period_start),
    current_period_end: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null
  };

  try {
    const subscription = await prisma.subscription.upsert({
      where: { id: subscriptionId },
      update: subscriptionData,
      create: subscriptionData
    })
  } catch (e) {
    throw e
  }
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${user.id}]`
  );
};

const upsertCustomerRecord = async (customer: Stripe.Customer) => {
  try {
    const user = await prisma.user.upsert({
      where: {
        stripe_customer_id: customer.id
      },
      update: {
        email: customer.email,
        stripe_customer_id: customer.id,
        name: customer.name
      },
      create: {
        email: customer.email,
        stripe_customer_id: customer.id,
        name: customer.name
      }
    })
  } catch (e) {
    throw e
  }  
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  upsertCustomerRecord
};

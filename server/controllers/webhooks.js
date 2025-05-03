import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Clerk Webhook Payload:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { data, type } = req.body;

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        console.log("User created:", userData);
        res.json({});
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("User updated:", data.id);
        res.json({});
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        res.json({});
        break;
      }

      default:
        console.log("Unhandled Clerk event type:", type);
        res.json({});
        break;
    }

  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY);
  } catch (err) {
    console.error("Stripe Webhook Error:", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Stripe Event Received:", event.type);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      console.log("PaymentIntent succeeded:", paymentIntentId);

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      courseData.enrolledStudents.push(userData);
      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = 'completed';
      await purchaseData.save();

      console.log(`Purchase completed for user ${userData._id} and course ${courseData._id}`);

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      console.log("PaymentIntent failed:", paymentIntentId);

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = 'failed';
      await purchaseData.save();

      console.log("Purchase marked as failed:", purchaseId);

      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  response.json({ received: true });
};

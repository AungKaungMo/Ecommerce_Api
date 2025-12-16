import { Inngest } from "inngest";
import { connectDB } from "./db";
import { User } from "../models/user.model";

export const inngest = new Inngest({id: "ecommerce"})

const syncUser = inngest.createFunction(
    {id: 'sync-user'},
    {event: 'clerk/user.created'},
    async({event}) => {
        await connectDB();
        const { id, email_address, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_address[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}` || "User",
            image_url: image_url,
            address: [],
            wishlist: []
        }

        await User.create(newUser);
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db"},
    {event: 'clerk/user.deleted'},
    async({event}) => {
        await connectDB();

        const { id } = event.data;
        
        await User.deleteOne({clerkId: id});
    }
)

export const functions = [syncUser, deleteUserFromDB]
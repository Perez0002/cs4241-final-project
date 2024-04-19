import User, { PERMISSIONS, addPermissionsToUser } from "./models/user.js";
import Event from "./models/event.js";
import Logger from "./models/actionlog.js";
import Account from "./models/account.js";

/**
*
* WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
*
* Only use when in DEVELOPMENT mode. 
* 
* @author Alexander Beck
*/
export async function testDB() {
    /* eslint-disable no-unused-vars */
    await clearEntireDB();
    const userS = {
        firstName: 'Alexander',
        lastName: 'Beck',
        gender: 'Male',
    };
    const user2S = {
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'Female',
    };
    const user3S = {
        firstName: 'John',
        lastName: 'Smith',
        gender: 'Male',
    };
    const user4S = {
        firstName: 'ale',
        lastName: 'asdf',
        gender: 'Female',
    };

    const userA = await Account.create({
        username: 'abeck',
        password: 'user1password'
    });

    const user2A = await Account.create({
        username: 'jdoe',
        password: 'user2password'
    });
    const user3A = await Account.create({
        username: 'jsmith',
        password: 'user3password'
    });
    const user4A = await Account.create({
        username: 'AHHHHHH',
        password: 'user4password'
    });

    const user = await User.createUser(userA, userS);
    const user2 = await User.createUser(user2A, user2S);
    const user3 = await User.createUser(user3A, user3S);
    const user4 = await User.createUser(user4A, user4S);

    try {
        // TODO: This might be causing an inconsistent error, keep an eye on it
        await addPermissionsToUser(user, true, PERMISSIONS.CREATE_EVENT, PERMISSIONS.INVITE_TO_ALL_EVENTS, PERMISSIONS.MODIFY_USERS);

        await user.addPermissionsToOtherUser(user2, PERMISSIONS.INVITE_TO_ALL_EVENTS);

        const christmasPartySchema = {
            name: 'Christmas Party',
            date: new Date(2024, 11, 25),
            location: 'Unity 520',
            guestLimit: 4
        };

        const christmasParty = await user.createEvent(christmasPartySchema);

        // Will be either christmasParty.invite(inviter, user) or user.inviteUsers(christmasParty, users).
        // Let me know which would make more sense.
        // await christmasParty.attendees.addToSet(
        //     { guest: user2, inviter: user },
        //     { guest: user3, inviter: user },
        //     );
        // await christmasParty.save();

        const users = [user, user2, user3, user4];
        await user.inviteUsers(christmasParty, user2, user3, user4);

        // await testUninvite(christmasParty, users)
        // await testMakeAdmin(users);

    } catch (err) {
        console.log(err);
    }
}

async function clearEntireDB() {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Logger.deleteMany({});
    await Account.deleteMany({});
}

async function testMakeAdmin(users) {
    console.log(await users[0].makeAdmin(users[1])); // false
    await addPermissionsToUser(users[0], true, PERMISSIONS.GIFT_ADMIN);
    console.log(await users[0].makeAdmin(users[1])); // true
}

async function testUninvite(christmasParty, users) {
    console.log(await users[0].uninviteUsers(christmasParty, users[2], users[2], users[3], users[2]));

}
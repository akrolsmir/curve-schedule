import { CONSTS } from "@/utils/constants";
import { base } from "./db";
import { SimpleUser } from "./auth";

export type BasicGuest = {
  Name: string;
  Email: string;
  ID: string;
};

export type GuestProfile = {
  Name: string;
  Email: string;
  Bio: string;
  Title: string;
  ID: string;
  Type:
    | "Speaker"
    | "Attendee"
    | "Staff"
    | "Facilitator"
    | "Volunteer"
    | "Other";
  X: string;
  LinkedIn: string;
  Discord: string;
  Github: string;
  "Personal website": string;
  Sessions: string[];
  RSVPs: string[];
  "Exp topics": string;
  "Curious topics": string;
  "Private notes": string;
  "Shirt size": "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XXL" | "";
};

export type GuestProfileAndAccount = {
  profile: GuestProfile;
  account?: SimpleUser;
};

export async function getGuests() {
  const guests: BasicGuest[] = [];
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestsByEvent(eventName: string) {
  const guests: BasicGuest[] = [];
  const filterFormula = CONSTS.MULTIPLE_EVENTS
    ? `SEARCH("${eventName}", {Events}) != 0`
    : "1";
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
      filterByFormula: filterFormula,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestByID(guestID: string) {
  const guests: GuestProfile[] = [];
  await base("Guests")
    .find(guestID)
    .then(function (record: any) {
      guests.push({ ...record.fields });
    });
  return guests[0];
}

export async function getGuestProfiles() {
  const guests: GuestProfile[] = [];
  await base("Guests")
    .select({
      view: "On agenda",
      fields: [
        "Name",
        "Email",
        "Bio",
        "Title",
        "Type",
        "X",
        "LinkedIn",
        "Discord",
        "Github",
        "Personal website",
        "Sessions",
        "RSVPs",
        "Exp topics",
        "Curious topics",
        "Private notes",
      ],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestBySlug(
  slug: string
): Promise<GuestProfile | null> {
  const guests: GuestProfile[] = [];
  await base("Guests")
    .select({
      filterByFormula: `{Slug} = '${slug}'`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests.length > 0 ? guests[0] : null;
}

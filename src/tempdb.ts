import { Bill } from "~/components/app/Bill";
import { List } from "~/components/app/List";
import { Poll } from "~/components/app/Poll";

type BillProps = Parameters<typeof Bill>[0];
type ListProps = Parameters<typeof List>[0];
type PollProps = Parameters<typeof Poll>[0];

type TempDB = {
  polls: { [key in string]: PollProps };
  lists: { [key in string]: ListProps };
  bills: { [key in string]: BillProps };
};
const tempdb: TempDB = {
  polls: {
    poll_1: {
      title: "Where shall we go?",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      expiry: new Date(),
      voters: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      items: [
        {
          id: "1",
          label: "Same as 2023",
          link: `https://www.vrbo.com/1234abc`,
          votes: 6,
        },
        {
          id: "2",
          label: "Umbrian Castle",
          link: `https://www.vrbo.com/abcd1`,
          votes: 4,
        },
        {
          id: "3",
          label: "Tenerife Villa",
          link: `https://www.vrbo.com/abcd1`,
          votes: 3,
        },
        {
          id: "4",
          label: "Cannes",
          link: `https://www.vrbo.com/abcd1`,
          votes: 2,
        },
        {
          id: "5",
          label: "Hamburg",
          link: `https://www.vrbo.com/abcd1`,
          votes: 2,
        },
        {
          id: "6",
          label: "Venice",
          link: `https://www.vrbo.com/abcd1`,
          votes: 1,
        },
        {
          id: "7",
          label: "Luxembourg",
          link: `https://www.vrbo.com/abcd1`,
        },
        {
          id: "8",
          label: "Bulgaria",
          link: `https://www.vrbo.com/abcd1`,
        },
      ],
    },
  },
  lists: {
    list_1: {
      title: "Shopping List",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      expiry: new Date(),
      items: [
        {
          id: "1",
          title: "Bananas",
          quantity: 10,
          assignee: "234",
        },
        {
          id: "2",
          title: "Eggs",
          quantity: 12,
          assignee: "123",
          status: "done",
        },
        { id: "3", title: "Condoms", quantity: 3 },
        {
          id: "4",
          title: "Peaches",
          quantity: 12,
          assignee: "567",
        },
        { id: "5", title: "Raspberries", quantity: 40 },
      ],
    },
  },
  bills: {
    bill_1: {
      title: "AirBnB money",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      expiry: new Date(),
      total: 3500,
      items: [
        {
          id: "1",
          quantity: 10,
          assignee: "234",
        },
        {
          id: "2",
          quantity: 12,
          assignee: "123",
        },
        { id: "3", quantity: 3 },
        {
          id: "4",
          quantity: 12,
          assignee: "567",
        },
        { id: "5", quantity: 40 },
      ],
    },
  },
};

export const getTempDBEntries = (): Promise<TempDB> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(tempdb);
    }, 700);
  });
};

export const getTempDBEntry = (
  area: keyof TempDB,
  id: keyof TempDB[keyof TempDB],
): Promise<TempDB[keyof TempDB][string]> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (tempdb[area][id]) {
        res(tempdb[area][id]);
      } else {
        rej(`No data found for ${area} ${id}`);
      }
    }, 700);
  });
};

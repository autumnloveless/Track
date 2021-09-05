# Track - A Financial Transactions Inbox
Keep track of your finances without all the clutter of traditional budget apps. Think email, but for your wallet.

## Features
- Link your bank accounts
- Read and Unread Transactions
- Star transactions to find easily later
- Tag transactions for convenient organization

## Stretch Goals
- Notifications
- Automatic filtering
- Snooze

## Installation
1. `Git clone` and `cd Track-API`
2. Set up database: you will need a postgres database to make this work. I used ElephantSQL to very quickly spin up a postgres machine (literally 2 minutes) for free.
3. Run database migrations with `npx sequelize db:migrate`
4. Run project with `npm run dev`
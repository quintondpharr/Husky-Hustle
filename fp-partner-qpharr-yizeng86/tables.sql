-- Exported From HuskyHustleDb.db
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Transactions" (
	"transactionId"	INTEGER,
	"buyerId"	INTEGER,
	"sellerId"	INTEGER,
	"productId"	INTEGER,
	"transactionDate"	NUMERIC,
	"price"	REAL,
	"confirmationNumber"	TEXT,
	PRIMARY KEY("transactionId" AUTOINCREMENT),
	FOREIGN KEY("productId") REFERENCES "Products"("productId"),
	FOREIGN KEY("buyerId") REFERENCES "Users"("userId"),
	FOREIGN KEY("sellerId") REFERENCES "Users"("userId")
);
CREATE TABLE IF NOT EXISTS "Users" (
	"userId"	INTEGER UNIQUE,
	"username"	TEXT,
	"password"	TEXT,
	"email"	TEXT,
	PRIMARY KEY("userId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Products" (
	"productId"	INTEGER,
	"productName"	TEXT,
	"productImageUrl"	TEXT,
	"productDescription"	TEXT,
	"price"	REAL,
	"category"	TEXT,
	"soldStatus"	INTEGER,
	"sellerId"	INTEGER,
	PRIMARY KEY("productId" AUTOINCREMENT)
);
COMMIT;

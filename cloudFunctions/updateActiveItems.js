// Todo:
// Create a new table called "ActiveItem"
// Add items when they are listed on the marketplace
// Remove them when they are bought or canceled

/* List a Item */
Moralis.Cloud.afterSave("ItemListed", async (request) => {
  // Every event gets triggered twice, once on unconfirmed, again on confirmed
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx.");

  // To create a new subclass, use the Moralis.Object.extend method.
  // Link : https://v1docs.moralis.io/moralis-dapp/database/objects#moralis.object.extend

  if (confirmed) {
    logger.info("Found Item!");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const activeItem = new ActiveItem();

    const query = new Moralis.Query(ActiveItem);
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      logger.info(
        `Deleting already listened ${request.object.get("objectId")}`
      );
      await alreadyListedItem.destroy();
      logger.info(`Deleted item with tokenId ${request.object.get("tokenId")}
        at address ${request.object.get(
          "address"
        )} since it's already been listed`);
    }

    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )}. tokenId: ${request.object.get("tokenId")}`
    );
    logger.info("Saving...");
    await activeItem.save();
  }
});

/* Cancel a Item */
Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Objet: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);

    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    logger.info(`Marketplace | Objcet: ${query}`);
    const canceledItem = await query.first();
    logger.info(`Marketplace | CancelItem: ${canceledItem}`);

    if (canceledItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address: ${request.object.get("address")} since it was canceled`
      );
      await canceledItem.destroy();
    } else {
      logger.info(
        `No item found with address: ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});

/* Buy a Item */
Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Objet: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);

    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    logger.info(`Marketplace | Objcet: ${query}`);
    const boughtItem = await query.first();

    if (boughtItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was bought.`
      );
      await boughtItem.destroy();
    } else {
      logger.info(
        `No item found with address: ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});

import BankAccount from "../Models/bank.account.model.js";

export const getMyBankAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find({
      ownerType: "User",
      ownerId: req._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.log("Get Bank Accounts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch saved bank accounts",
    });
  }
};

export const deleteBankAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await BankAccount.findOne({
      _id: accountId,
      ownerType: "User",
      ownerId: req._id,
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    await BankAccount.findByIdAndDelete(accountId);

    return res.status(200).json({
      success: true,
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    console.log("Delete Bank Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete bank account",
    });
  }
};

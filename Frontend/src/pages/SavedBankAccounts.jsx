import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function SavedBankAccounts() {

    const [accounts,setAccounts]=useState([]);

    useEffect(()=>{
        loadAccounts();
    },[]);

    async function loadAccounts(){

        const res=await api.get("/bank-account/my");

        if(res.data.success){

            setAccounts(res.data.accounts);

        }

    }

    return(

        <div className="min-h-screen bg-[#111827] p-8">

            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between mb-8">

                    <h1 className="text-white text-4xl font-bold">
                        Saved Bank Accounts
                    </h1>

                </div>

                <div className="space-y-5">

                    {accounts.map(account=>(

                        <div
                        key={account._id}
                        className="bg-[#1F2937] rounded-xl p-6 flex justify-between items-center">

                            <div>

                                <h2 className="text-white text-xl">

                                    {account.bankName}

                                </h2>

                                <p className="text-gray-400">

                                    **** **** **** {account.accountNumberLast4}

                                </p>

                                <p className="text-sm text-green-400">

                                    {account.verificationStatus}

                                </p>

                            </div>

                            <button
                            className="bg-red-500 px-5 py-2 rounded-lg text-white">

                                Delete

                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}
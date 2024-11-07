import axios from 'axios';

type Transaction = {
  status: 'initiated' | 'processing' | 'processed';
  type: 'debit' | 'credit';
  amount: number;
  denomination: string;
  title: string;
  date: string;  // You may need to get the date from the transaction.
};

export const getUserAddress = async (id: string) => {
  try {
    const response = await axios.get(`http://13.233.2.87:3000/user/address/${id}`);
    return response.data.address;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAndLogUserAddress = async (userId: string) => {
  try {
    const userAddress = await getUserAddress(userId);
    console.log('userAddress', userAddress);
    return userAddress;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getUserBalance = async (userAddress: string) => {
  try {
    const response = await axios.get(
      `http://13.235.27.229:1317/cosmos/bank/v1beta1/balances/${userAddress}?pagination.limit=3&pagination.offset=0&pagination.count_total=true`
    );
    let data = response.data.balances[0].amount / 1000000;
    return data.toString();
  } catch (error) {
    console.error(error);
  }
};

export const getTransactionHistory = async (userAddress: string): Promise<Transaction[]> => {
  try {
    const response = await axios.get(
      `http://13.235.27.229:1317/cosmos/tx/v1beta1/txs?query=transfer.recipient%3D%27${userAddress}%27&pagination.limit=100&pagination.offset=0&pagination.count_total=true`
    );

    const transactions: Transaction[] = response.data.tx_responses.map((txResponse: any) => {
      const transaction: Transaction = {
        status: 'processed',
        type: txResponse.tx.body?.messages?.[0]?.from_address === userAddress ? 'debit' : 'credit',
        amount: parseInt(txResponse.tx.body?.messages?.[0]?.amount?.[0]?.amount || '0') / 1000000,
        denomination: (txResponse.tx.body?.messages?.[0]?.amount?.[0]?.denom || '').toUpperCase(),
        title: 'Money',
        date: (txResponse.timestamp || '').toUpperCase(),  // Extracting timestamp from tx_response
      };

      return transaction;
    });
    return transactions;
  } catch (error) {
    console.error(error);
    return [];
  }
};
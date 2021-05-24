import Transaction, { transactionType } from "models/transaction";
import api from "utils/clientApi";
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from "date-fns/locale";

interface transactionsPagedResponse {
  pagination_metadata: {
    page: number;
    per_page: number;
    page_count: number;
    total_count: number;
    links: object;
  };
  records: Transaction[];
}

export interface transactionFilters {
  page?: number;
  per_page?: number;
  start_date?: Date;
  finish_date?: Date;
  transaction_type?: transactionType;
  description?: string;
  product_name?: string;
  provider_name?: string;
}

export default class TransactionService {
  public async fetch(
    filters: transactionFilters = {
      page: 0,
      per_page: 20,
    }
  ): Promise<transactionsPagedResponse> {
    var { page } = filters;
    page = !page || page === 0 ? 1 : page + 1;
    try {
      const parsedFilter = this.parseFilters(filters);
      console.log("parsedFilter::", parsedFilter);
      const result = await api.get(`/transaction/page/${page}`, {
        params: { ...parsedFilter },
      });
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    try {
      const saveEndpoint =
        transaction.type === "ENTRADA" ? "incoming" : "outgoing";
      transaction = this.parseDates(transaction)
      if(!transaction.provider_id) delete transaction.provider_id;
      const newTransaction: Transaction = await api.post(
        `${saveEndpoint}/transaction/`,
        transaction
      );

      return newTransaction;
    } catch (error) {
      const errorMessage = error.response.data.detail;
      throw new Error(errorMessage);
    }
  }

  private parseDates(transaction: Transaction) {
    const DateUtils = new DateFnsUtils({locale: ptBR});

    transaction.date = DateUtils.format(new Date(transaction.date), 'yyyy-MM-dd')
    return transaction
  }

  private parseFilters(filters: transactionFilters) {
    const parsedFilter: any = {
      per_page: filters.per_page,
    };

    if (filters.transaction_type && filters.transaction_type !== "TODAS")
      parsedFilter.transaction_type = filters.transaction_type;
    if (filters.description) parsedFilter.description = filters.description;
    if (filters.product_name) parsedFilter.product_name = filters.product_name;
    if (filters.provider_name)
      parsedFilter.provider_name = filters.provider_name;
    
    if(filters.start_date || filters.finish_date) {
      const DateUtils = new DateFnsUtils({locale: ptBR});
      if(filters.start_date) parsedFilter.start_date = DateUtils.format(filters.start_date, "yyyy-MM-dd")
      if(filters.finish_date) parsedFilter.finish_date = DateUtils.format(filters.finish_date, "yyyy-MM-dd")
    }

    return parsedFilter;
  }

  public async list(): Promise<Transaction[]> {
    try {
      const response = await api.get(`/transaction`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
}

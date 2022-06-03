import {Context} from "./router";

interface Error {
    error_number: number,
    error_msg: string,
}

interface ErrorResponse {
    error: Error,
}

interface ErrorsList {
    [index: number]: string
}

interface CustomErrorProps {
    numberOfError?: number,
}

const constructError = (n?: number, v?: string): ErrorResponse => ({ error: { error_number: n || 1, error_msg: v || 'Unexpected error', } })

export class CustomError {
    errorNumber?: number;
    constructor({ numberOfError }: CustomErrorProps) {
        this.errorNumber = numberOfError;
    }

    ersponse(ctx: Context) {
        if (this.errorNumber && Errors[this.errorNumber]) {
           return ctx.body = constructError(this.errorNumber, Errors[this.errorNumber]);
        }

        return ctx.body = constructError();
    }
}

const Errors: ErrorsList = {
    1: "Internal error",
    2: 'Unexpected route'
}

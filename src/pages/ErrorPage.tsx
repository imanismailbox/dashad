import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AppHelmet from "@/components/AppHelmet";
import { coerceNumber } from "@/utils";
import { Button } from "@/components/ui/button";

const HTTP_MESSAGES = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

type HttpCode = keyof typeof HTTP_MESSAGES;

const ErrorPage: React.FC<{ code?: HttpCode }> = ({ code = 404 }) => {
  let { status = code } = useParams();
  const [searchParams] = useSearchParams();

  status = coerceNumber(status) as HttpCode;
  const message = searchParams.get("message") || HTTP_MESSAGES[status];

  return (
    <>
      <AppHelmet title={`${status} ${message}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Error {status}
            </h3>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Link to="/">
              <Button className="mt-4">Kembali ke beranda</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default ErrorPage;

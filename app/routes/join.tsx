import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import SideBar from "~/components/sidebar";
import { getUserId } from "~/session.server";

import { checkCode } from "../models/code.server";


export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const code = formData.get("code");

  if (typeof code !== "string" || code.length === 0) {
    return json({ status: 200, message: "Invalid Code" })
  }

  const codeResponse = await checkCode(code);

  if (!codeResponse) {
    return json({ status: 200, message: "Invalid Code" })
  }

  if (codeResponse.status === 200) {
    return json({ status: 200, message: codeResponse.message })
  }

  if (codeResponse.status === 418) {
    return json({ status: 418, message: codeResponse.message })
  }

  return json({ status: 418, message: "Invalid Code" })


}

export default function Join() {
  const actionData = useActionData<typeof action>();
  const codeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.status === 418) {
      codeRef.current?.focus()
    }
    if (!actionData) {
      codeRef.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="bg-gray-900">
      <div className="absolute z-10 top-0 left-0 right-0 opacity-100 ">
        <SideBar />
      </div>
      <section className="h-screen bg-cover opacity-90 bg-[url('https://images.unsplash.com/photo-1542396601-dca920ea2807?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1502&q=80')]">
        <div className="flex h-full w-full items-center justify-center container mx-auto px-8">
          <div className="max-w-2xl text-center">
            <h1 className="text-3xl sm:text-5xl capitalize tracking-widest text-white lg:text-7xl">Registration is currently closed.</h1>

            <p className="mt-6 lg:text-lg text-white">If an account was created for you, its credentials will be included in an email.</p>
            <p className="mt-6 lg:text-lg text-white">If you have a code, enter it below.</p>

            {actionData?.status === 418 ?
              <div className="w-fit mx-auto px-4 py-2 text-red-500 text-lg tracking-wider bg-gray-900 bg-opacity-90 rounded-md">
                {actionData.message}
              </div> : null}

            <Form method="post" className="mt-8 flex flex-col space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0">
              <input ref={codeRef} name="code" required type="text" className="rounded-md border border-transparent bg-white/20 px-4 py-2 text-white placeholder-white backdrop-blur-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:mx-2" placeholder="Enter Code" />

              <button type="submit" className="transform rounded-md bg-blue-700 px-8 py-2 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none sm:mx-2">Submit</button>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}

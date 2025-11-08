import { Spinner } from "@/components/ui/spinner";

const Loader = () => (
  <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
    <Spinner /> Loading...
  </div>
);

export default Loader;

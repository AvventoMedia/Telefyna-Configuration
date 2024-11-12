import Image from "next/image";
import InitialForm from "@/components/forms/InitialForm";
import {Toaster} from "sonner";
import DeletePlaylistScheduleForm from "@/components/forms/DeletePlaylistScheduleForm";
import CreatePlaylistForm from "@/components/forms/CreatePlaylistForm";
import EditPlaylistForm from "@/components/forms/EditPlaylistForm";

export default function Home() {
  return (
      <div className="flex h-screen max-h-screen">
          <Toaster richColors />
          <section className="remove-scrollbar container my-auto">
              <div className="sub-container flex flex-row justify-center items-center">
                  <Image
                      src="/assets/images/telefyna.png"
                      width={1000}
                      height={1000}
                      alt="Telefyna"
                      className="text-white mb-12 h-10 w-fit"
                  />
              </div>
              {/*<InitialForm/>*/}
              {/*<DeletePlaylistScheduleForm />*/}
              {/*<CreatePlaylistForm />*/}
              <EditPlaylistForm />
              <div className="text-14-regular mt-20 flex justify-between">
                  <p className="justify-items-end text-dark-600 xl:text-left">
                      @2024 TelefynaConfiguration
                  </p>
                  <p className="text-green-500">AvventoMedia</p>
              </div>
          </section>
          {/*<Image*/}
          {/*    src="/assets/images/onboarding-img.png"*/}
          {/*    alt="schedule"*/}
          {/*    height={1000}*/}
          {/*    width={1000}*/}
          {/*    className="side-img max-w-[50%]"*/}
          {/*/>*/}
      </div>
  );
}

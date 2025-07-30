import { cn } from "@/lib/utils";

interface ProductImageSectionProps {
  image: string;
  name: string;
  className?: string;
}

const ProductImageSection = ({
  image,
  name,
  className,
}: ProductImageSectionProps) => {
  return (
    <div className={cn("flex justify-center items-start reveal ", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-bella/20 rounded-full blur-3xl opacity-50"></div>
        <img
          src={
            image === "/imgs/multiguard20.png"
              ? "/imgs/39fb31a4-d84c-4571-abf3-c561610bd18d.png"
              : image
          }
          alt={name}
          className="relative z-10 max-w-[280px] md:max-w-full"
        />
      </div>
    </div>
  );
};

export default ProductImageSection;

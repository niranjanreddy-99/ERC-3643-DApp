export const BuidlGuidlLogo = ({
  className,
  width = "53",  // Default width
  height = "72", // Default height
  fill = "currentColor" // Default fill color
}: {
  className: string;
  width?: string;
  height?: string;
  fill?: string;
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 53 72"
      fill={fill} // Allows custom fill color
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M25.9 17.434v15.638h3.927v9.04h9.718v-9.04h6.745v18.08l-10.607 19.88-12.11-.182-12.11.183L.856 51.152v-18.08h6.713v9.04h9.75v-9.04h4.329V2.46a2.126 2.126 0 0 1 4.047-.914c1.074.412 2.157 1.5 3.276 2.626 1.33 1.337 2.711 2.726 4.193 3.095 1.496.373 2.605-.026 3.855-.475 1.31-.47 2.776-.997 5.005-.747 1.67.197 2.557 1.289 3.548 2.509 1.317 1.623 2.82 3.473 6.599 3.752l-.024.017c-2.42 1.709-5.726 4.043-10.86 3.587-1.605-.139-2.736-.656-3.82-1.153-1.546-.707-2.997-1.37-5.59-.832-2.809.563-4.227 1.892-5.306 2.903-.236.221-.456.427-.67.606Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

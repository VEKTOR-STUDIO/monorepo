import { Folder } from "remotion";
import { projects } from "./projects";

/**
 * La raíz no sabe nada de ningún cliente: solo recorre el registro y le da a
 * cada proyecto su propia carpeta. Agregar un cliente nuevo no toca este
 * archivo.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {projects.map((project) => (
        <Folder key={project.id} name={project.folder}>
          <project.Compositions />
        </Folder>
      ))}
    </>
  );
};

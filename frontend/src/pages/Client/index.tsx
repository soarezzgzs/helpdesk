import { AppLayout } from "../../layouts/AppLayout";

export function Client() {
    const tickets = [
  {
    id: "00001",
    title: "Rede lenta",
    service: "Instalação de Rede",
    value: "R$ 180,00",
    technician: "Carlos Silva",
    status: "Aberto",
  },

  {
    id: "00002",
    title: "Computador não liga",
    service: "Hardware",
    value: "R$ 150,00",
    technician: "Ana Oliveira",
    status: "Encerrado",
  },
];

  return (
    <AppLayout>
      <div className="bg-white rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-blue-700">
          Meus chamados
        </h1>

        <div className="mt-8 overflow-x-auto">

  <table className="w-full">

    <thead>

      <tr className="text-left border-b">

        <th className="pb-4">ID</th>

        <th className="pb-4">Título</th>

        <th className="pb-4">Serviço</th>

        <th className="pb-4">Valor</th>

        <th className="pb-4">Técnico</th>

        <th className="pb-4">Status</th>

      </tr>

    </thead>

    <tbody>

      {tickets.map((ticket) => (

        <tr
          key={ticket.id}
          className="border-b"
        >

          <td className="py-4">
            {ticket.id}
          </td>

          <td>
            {ticket.title}
          </td>

          <td>
            {ticket.service}
          </td>

          <td>
            {ticket.value}
          </td>

          <td>
            {ticket.technician}
          </td>

          <td>
            {ticket.status}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

      </div>
    </AppLayout>
  );
}
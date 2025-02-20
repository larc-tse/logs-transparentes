import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import modalclosebutton from '../../../assets/modalclosebutton.svg';
import modalbaixarfolhasbutton from '../../../assets/modalbaixarfolhasbutton.svg';
import { fetchRootValue, fetchNumberOfElementsOnTree, fetchRootTimestampValue, downloadFile } from '../../../services/modalTreeDashboardServices';
import { convertElectionIdToName } from '../../../components/electionIdConverter';

const bu_api_url = process.env.REACT_APP_API_URL;

const Modal = ({ isOpen, onClose, card, isFirst }) => {
  const [rootValue, setRootValue] = useState('');
  const [numberOfElementsOnTree, setNumberOfElementsOnTree] = useState('');
  const [rootTimestampValue, setRootTimestampValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!card) return;

      if (card.treeInfoUrl) {
        setRootValue(await fetchRootValue(card.treeInfoUrl));
      }

      if (card.treeInfoUrl) {
        setNumberOfElementsOnTree(await fetchNumberOfElementsOnTree(card.treeInfoUrl));
      }

      if (card.treeInfoUrl) {
        setRootTimestampValue(await fetchRootTimestampValue(card.treeInfoUrl));
      }
    };

    fetchData();
  }, [card, isFirst]);

  if (!isOpen || !card) return null;

  const handleDownloadLeaves = async () => {
    const downloadLeavesUrl = isFirst ? `${bu_api_url}/tree/all-leaf-data-global-tree` : card.downloadLeavesUrl;
    if (downloadLeavesUrl) {
      await downloadFile(downloadLeavesUrl, `Folhas_da_${card.title}.json`);
    } else {
      alert('URL de download não disponível.');
    }
  };

  const electionName = isFirst ?  '' : convertElectionIdToName(card.treeIndex);
  const treeIndex = isFirst ? 'Global' : card.treeIndex;
  const description = isFirst ? 'Raiz da árvore global' : card.description;
  const dataType = isFirst ? 'Raízes' : 'BUs';

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg border border-[#1094AB] shadow-lg w-11/12 max-w-md md:max-w-[900px]">
        <div className="relative mb-4">
          <h2 className="text-2xl font-inter font-size-24px text-[#1094AB] mb-4">
            Árvore de BUs - {treeIndex}
            <button className="absolute top-0 right-0" onClick={onClose}>
              <img src={modalclosebutton} alt="Botão de fechar" className="w-6 h-6 rounded" />
            </button>
          </h2>
        </div>
        <p className="font-inter font-size-16px text-black mb-4 break-words">{description} {electionName}</p>
        <div className="rounded-lg flex flex-col gap-4">
          <div className="border border-gray rounded-lg p-2 break-words">
            <h1 className="text-[#1094AB] font-inter font-size-14px text-left"><span className="font-semibold">Detalhes da árvore:</span></h1>
            <h2 className="text-[#979797] font-inter font-size-15px ml-2 break-words">
              Raiz: <span className="font-bold">{rootValue}</span>
            </h2>
            <h2 className="text-[#979797] font-inter font-size-15px ml-2 break-words">
              Nome da árvore: <span className="font-bold">{card.title}</span>
            </h2>
            <h2 className="text-[#979797] font-inter font-size-15px ml-2">
              Última atualização: <span className="font-bold">{rootTimestampValue}</span>
            </h2>   
          </div>
          <div className="border border-gray rounded-lg p-2 break-words">
            <h1 className="text-[#1094AB] font-inter font-size-14px text-left"><span className="font-semibold">Dados:</span></h1>
            <h2 className="text-[#979797] font-inter font-size-15px ml-2">
              Tipo de Dados: <span className="font-bold">{dataType}</span>
            </h2>
            <h2 className="text-[#979797] font-inter font-size-15px ml-2">
              Número: <span className="font-bold">{numberOfElementsOnTree}</span>
            </h2>
          </div>
        </div>
        <div className="relative mt-4 flex justify-start">
          <button className="gap-4" onClick={handleDownloadLeaves}>
            <img src={modalbaixarfolhasbutton} alt="Botão de baixar folhas" className="w-[131px] h-[35px]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

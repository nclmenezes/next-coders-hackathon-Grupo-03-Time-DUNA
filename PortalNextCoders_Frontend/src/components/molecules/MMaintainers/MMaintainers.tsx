import swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import maintainersContractorService, { IContractorMaintainer, RefreshMaintainersContractorDto } from '../../../services/api/maintainers/maintainersContractor.service';
import MLoading from '../MLoading';
import MListMaintainers from './MListMaintainers';
import MAddMaintainer from './MAddMaintainer';
import { MModalConfirm } from './MModalConfirm';

interface IPropsMaintainers {
  contractorId: number;
  maintainers: IContractorMaintainer[];
  isModalOpen: boolean;
  onClose: () => void;
  onMaintainersChange: () => void;
}

export function MMaintainers({ contractorId, maintainers, isModalOpen, onClose, onMaintainersChange }: IPropsMaintainers) {
  const [currentMaintainer, setCurrentMaintainer] = useState<IContractorMaintainer>();
  const [allMaintainers, setAllMaintainers] = useState<IContractorMaintainer[]>([]);
  const [selectedMaintainerIds, setSelectedMaintainerIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddMaintainerModalOpen, setIsAddMaintainerModalOpen] = useState(false);
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [isAddConfirmModal, setIsAddConfirmModal] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);

  const findAllMainteiners = async () => {
    setIsLoading(true);
    try {
      onMaintainersChange();
      const maintainersReturn = await maintainersContractorService.GetAllMaintainers(contractorId, true);
      setAllMaintainers(maintainersReturn);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaintainerOpen = () => {
    setIsAddMaintainerModalOpen(true);
  };

  const handleAddMaintainerClose = () => {
    setIsAddMaintainerModalOpen(false);
  };  

  const handleDeleteConfirmModalOpen = (maintainer: IContractorMaintainer) => {
    setCurrentMaintainer(maintainer);
    setIsDeleteConfirmModal(true);
  };

  const handleDeleteConfirmModalClose = () => {
    setIsDeleteConfirmModal(false);
  };  

  const handleAddConfirmModalOpen = (ids: number[]) => {
    if(ids.length > 0){
      setSelectedMaintainerIds(ids);
      setIsAddConfirmModal(true);
    }
  };

  const handleAddConfirmModalClose = () => {
    setIsAddConfirmModal(false);
  };   

  const handleDeleteMaintainer = async () => {
    setIsLoadingConfirm(true);
    try{
      await maintainersContractorService.DeleteMaintainersContractor(contractorId, currentMaintainer!.maintainerId);
      findAllMainteiners();
      handleDeleteConfirmModalClose();
    }catch(error){
      console.log(error);
    }finally{
      setIsLoadingConfirm(false);
    }
  };

  const handleAddSelectedMaintainers = async () => {
    setIsLoadingConfirm(true);
    try{
      const insertMaintainers: RefreshMaintainersContractorDto[] = selectedMaintainerIds.map((maintainerId) => {
        return {
          contractorId: contractorId,
          maintainerId: maintainerId,
        };
      });
      await maintainersContractorService.InsertContractorLink(insertMaintainers);
      await findAllMainteiners();
      handleAddConfirmModalClose();
      handleAddMaintainerClose();
      setSelectedMaintainerIds([]);
    }catch(error){
      console.log(error);
    }finally{
      setIsLoadingConfirm(false);
    }

  };
  
  useEffect(() => {
    if (isModalOpen)
      findAllMainteiners();
  }, [isModalOpen]);

  return (
    <div>
      {(isLoading || isLoadingConfirm) ? (
        <MLoading />
      ) : (   
      <>
        <MListMaintainers
          maintainers={maintainers}
          isModalOpen={isModalOpen}
          onClose={onClose}
          onConfirm={handleDeleteConfirmModalOpen}
          onOpenAddMaintainer={handleAddMaintainerOpen}
        />

        <MModalConfirm
          actionTitle="Deseja remover o mantenedor?"
          isModalOpen={isDeleteConfirmModal}
          onClose={handleDeleteConfirmModalClose}
          onExecute={handleDeleteMaintainer}
        />

        <MAddMaintainer
          allMaintainers={allMaintainers}
          isModalOpen={isAddMaintainerModalOpen}
          onClose={handleAddMaintainerClose}
          onConfirm={handleAddConfirmModalOpen}
        />

        <MModalConfirm
          actionTitle="Deseja adicionar esses mantenedores?"
          isModalOpen={isAddConfirmModal}
          onClose={handleAddConfirmModalClose}
          onExecute={handleAddSelectedMaintainers}
        />        
      </>   
     
      )}
    </div>
  );
}

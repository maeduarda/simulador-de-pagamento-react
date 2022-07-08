import React from 'react';
import axios from "axios";
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import NumberFormat from 'react-number-format';


  export default function App(){

    let [users, setUsers] = useState([])
    useEffect(() => {
        axios.get('https://www.mocky.io/v2/5d531c4f2e0000620081ddce', {
            method: 'GET',
        }).then((resp) => {setUsers(resp.data)})
    }, [])


    let cards = [
            // valid card
            {
            card_number: '1111111111111111',
            cvv: 789,
            expiry_date: '01/18',
            },
            // invalid card
            {
            card_number: '4111111111111234',
            cvv: 123,
            expiry_date: '01/20',
            },
        ];



    const [modalIsOpen, setIsOpen] = React.useState(false); //constante do modal de pagamento
    const [modalResultIsOpen, setModalIsResultOpen] = React.useState(false); //constante do modal de recibo


    let [UsuarioName, setUsuarioName] = useState("");  //constante para pegar o nome do usuário
    let [valueCards, setValueCards] = useState({});  // constante para mostrar  cartões no select
    let [valueMoney, setValueMoney] = useState(''); // constante para pegar o valor 
    let [required, setRequired] = useState('none'); // constante de validaçãodo campo 
    let [paymentError, setPaymentError] = useState("");




    //função que abre o modal de pagamento e envia o nome do usuário
    function openModal(name) {
        setIsOpen(true);
        setUsuarioName(name)
    }

    //função que fecha o modal
    function closeModal() {
        setIsOpen(false);
    }


    function inputChange(e) {
        setValueMoney(e.target.value);
    }

    
    const POSTObject = {
        UsuarioName,
        valueMoney,
        valueCards,
      };

    // função do modal de recibo
    function openModalResult() {
        console.log(POSTObject)
        if(valueMoney === ""){
            setRequired('block')
        } else{
            axios
            .post(
              "https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989",
              POSTObject
            )
            .then((response) => {
              console.log(response);
              if (response.data.status === "Aprovada") {
                setPaymentError("O pagamento foi concluído com sucesso!");

              } else if (response.data.status !== "Aprovada") {
                setPaymentError("O pagamento não foi concluído com sucesso");

              }
            })
            .catch((error) => {
              console.log(error);
            });

            setValueMoney('')
            setModalIsResultOpen(true)
            setRequired('none')
        }
    }

    // função para fechar modal de recibo
    function closeModalPayment() {
        setModalIsResultOpen(false);
        setIsOpen(false);
    }


    function handleChange(e) {
        setValueCards(cards[+e.target.value]);
    }

    return(
        <>
        {users.map((user, index) =>{
            return (

            <div className='accountContainer' key={'user'+index}>
                    <img className='imageUser' src={user.img} alt=""/>
                    <div className='infoUser'>
                        <p className='userName'>Nome do Usuário {user.name}</p>
                        <p className='userId'>ID: {user.id} - Username: {user.username}</p>
                    </div>
                <button type='submit' className='button' onClick={()=>{openModal(user.name)}}>Pagar</button>
            </div>

            )
        })}
         {/* Modal para o pagamento */}
    
         <Modal
                className='modal'
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                >
                <span>Pagamento para <b>{UsuarioName}</b></span>
                <div>
                <NumberFormat thousandSeparator={true}  prefix={'R$ '} inputmode="numeric" onChange={inputChange} placeholder="R$ 0,00" value={valueMoney}/>
                <p className='required' style={{display:required}}>Campo obrigatório</p>
                </div>
                <select onChange={handleChange}>
                    {cards.map((card) => (
                        <option key={card.card_number}>
                            Cartão com final: {card.card_number.substr(-4)}
                        </option>
                    ))}
                </select>
                <button onClick={()=>{openModalResult()}}>Pagar</button>
           </Modal>

           {/* Modal de recibo */}
           <Modal
           className='modal'
           isOpen={modalResultIsOpen}
           onRequestClose={closeModalPayment}
           >
               <span>Recibo de pagamento</span>
               <p>{paymentError}</p>
               <button onClick={()=>{closeModalPayment()}}>Fechar</button>
           </Modal>
      </>
    )
}

Modal.setAppElement('body') 
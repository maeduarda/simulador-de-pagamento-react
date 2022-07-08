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
    let [valueCards, setValueCards] = useState('1');  // constante para mostrar  cartões no select
    console.log(valueCards)
    let [valueMoney, setValueMoney] = useState(''); // constante para pegar o valor 
    let [required, setRequired] = useState('none'); // constante de validação do campo 
    let [paymentError, setpaymentError] = useState("");
    

    
        
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
    
    // função do modal de recibo
    function openModalResult() {
        if(valueMoney === ""){
            setRequired('block')
        } else{
            if(valueCards==='1'){
                setpaymentError('')

            }else{
                setpaymentError('não')
               
            }
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

    //função para chamar os valores dos cartões
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
                <button className='button' onClick={()=>{openModal(user.name)}}>Pagar</button>
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
                <NumberFormat thousandSeparator={true}  prefix={'R$ '} inputmode="numeric" onChange={inputChange} placeholder="R$ 0,00"/>
                <p className='required' style={{display:required}}>Campo obrigatório</p>
                </div>
                <select onChange={handleChange}>
                    {cards.map((card, index) => (
                        <option key={index} value="index">
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
               <p>O pagamento <strong>{paymentError}</strong> foi concluído com sucesso</p>
               <button onClick={()=>{closeModalPayment()}}>Fechar</button>
           </Modal>
      </>
    )
}

Modal.setAppElement('body')   

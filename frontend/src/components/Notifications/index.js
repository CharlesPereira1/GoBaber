/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import {
  Container,
  Badge,
  Scroll,
  NotificationList,
  Notification,
} from './styles';

/**
 * hasUnread - notitificação que será passada quando tiver true, user nao leu
 * unread - marcada como se não tivesse sido lida
 */
export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /**
   * useMemo - recalcula valor, utilizado para retornar se tem notificaçao nao lida no sino de notification
   * !! - utilizado para retornar se encontrar notification para true e false se não encontrar
   * para mudar o estado do icone do sino ai ficará laranja a notification se tiver msg ñ lida
   */
  const hasUnread = useMemo(
    () => !!notifications.find(notification => notification.read === false),
    [notifications]
  );

  /**
   * useEffect - dispara ação assim que o componente é montado
   * parseISO - converte uma data em formato de texto para um formato date no JS
   * formatDistance - cria um formato de distancia, ex.: esta data foi a 5min atras
   * pt - formato em pt-br
   * ------------------------
   * const data - é uma variavel que percorre cada uma das notifications com auxilio do map
   * e retorna um objeto notification com os dados dentro do objeto
   * addSuffix - se for true o sistema vai informar que tal processo foi atualizado há 3dias atras por exemplo
   */
  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('notifications');

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
      }));

      setNotifications(data);
    }

    loadNotifications();
  }, []);

  /**
   * este comando serve para esconder a tela de notification
   * se estiver false transforma em true e se tiver true transforma em false
   * depois que criar a função é necessario ir no style e criar a condiçao
   * no NotificationList criar display: ${props => (props.visible ? 'block' : 'none')};
   */
  function handleToggleVisible() {
    setVisible(!visible);
  }

  /**
   * Marca notification como lida, atualiza o campo read do mongoDB
   * @param {busca id principal da tabela do postgree} id
   */
  async function handleMaskAsRead(id) {
    await api.put(`notifications/${id}`);

    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  return (
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notification => (
            <Notification key={notification._id} unread={!notification.read}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance}</time>
              {!notification.read && (
                <button
                  type="button"
                  onClick={() => handleMaskAsRead(notification._id)}
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}

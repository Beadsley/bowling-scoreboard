import request from './httpClient';

export const appendScore = (id, score) => {
  return request({
    method: 'put',
    url: `/api/player/score/${id}`,
    body: { roll: score },
  });
};

export const createPlayer = (name) => {
  return request({
    method: 'post',
    url: '/api/player/',
    body: { name },
  });
};

export const deletePlayer = (id) => {
  return request({
    method: 'delete',
    url: `api/player/${id}`,
  });
};

export const player = (id) => {
  return request({
    method: 'get',
    url: `/api/player/${id}`,
  });
};

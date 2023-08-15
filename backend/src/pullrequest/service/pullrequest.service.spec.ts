import { PullRequestService } from './pullrequest.service';
import { PullRequestRepository } from '../repository/pullrequest.repository';

jest.mock('../repository/pullrequest.repository');

const REVIEW_DUE_AFTER_MINUTES = 60;
describe('PullRequestService', () => {
  let pullRequestService: PullRequestService;
  let pullRequestRepository: PullRequestRepository;

  beforeEach(() => {
    const mockPrisma = jest.fn() as any;
    pullRequestRepository = new PullRequestRepository(
      mockPrisma,
    ) as jest.Mocked<PullRequestRepository>;
    pullRequestService = new PullRequestService(
      pullRequestRepository,
      REVIEW_DUE_AFTER_MINUTES,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthoredByUser', () => {
    it('should return authored pull requests with calculated due and warning times', async () => {
      pullRequestRepository.getByAuthorId = jest
        .fn()
        .mockImplementation(async (userId: number) => {
          return [
            {
              title: 'Sample PR 1',
              url: 'https://github.com/user/repo/pull/1',
              repository: { name: 'repo1' },
              reviewRequests: [
                { id: 1, requestedAt: new Date('2023-08-07T12:00:00Z') },
              ],
            },
            {
              title: 'Sample PR 2',
              url: 'https://github.com/user/repo/pull/2',
              repository: { name: 'repo2' },
              reviewRequests: [
                { id: 2, requestedAt: new Date('2023-08-07T12:00:00Z') },
              ],
            },
          ];
        });
      const userId = 123;
      const authoredPullRequests = await pullRequestService.getAuthoredByUser(
        userId,
      );

      expect(authoredPullRequests).toHaveLength(2);
      expect(authoredPullRequests[0]).toHaveProperty('reviewRequests');
      expect(authoredPullRequests[0].reviewRequests).toHaveLength(1);
      expect(authoredPullRequests[0].reviewRequests[0]).toHaveProperty('dueAt');
      expect(authoredPullRequests[0].reviewRequests[0]).toHaveProperty(
        'deadlineWarningAt',
      );
      const expectedDueTime = new Date('2023-08-07T13:00:00Z');
      const expectedDeadlineWarningTime = new Date('2023-08-07T12:30:00Z');

      expect(authoredPullRequests[0].reviewRequests[0].dueAt).toEqual(
        expectedDueTime,
      );
      expect(
        authoredPullRequests[0].reviewRequests[0].deadlineWarningAt,
      ).toEqual(expectedDeadlineWarningTime);
    });

    it('should handle empty reviewRequests array correctly', async () => {
      pullRequestRepository.getByAuthorId = jest.fn().mockResolvedValueOnce([
        {
          title: 'Sample PR 1',
          url: 'https://github.com/user/repo/pull/1',
          repository: { name: 'repo1' },
          reviewRequests: [],
        },
      ]);

      const userId = 123;
      const authoredPullRequests = await pullRequestService.getAuthoredByUser(
        userId,
      );

      expect(authoredPullRequests).toHaveLength(1);

      expect(authoredPullRequests[0].reviewRequests).toHaveLength(0);
    });
  });

  describe('getReviewsRequestedFromUser', () => {
    it('should calculate dueAt and deadlineWarningAt correctly', async () => {
      pullRequestRepository.getByReviewAssignee = jest
        .fn()
        .mockResolvedValueOnce([
          {
            title: 'Sample PR 1',
            url: 'https://github.com/user/repo/pull/1',
            repository: { name: 'repo1' },
            reviewRequests: [
              { id: 1, requestedAt: new Date('2023-08-07T12:00:00Z') },
            ],
          },
        ]);

      const userId = 123;
      const reviewsRequestedFromUser =
        await pullRequestService.getReviewsRequestedFromUser(userId);

      expect(reviewsRequestedFromUser).toHaveLength(1);

      const expectedDueTime = new Date('2023-08-07T13:00:00Z');
      const expectedDeadlineWarningTime = new Date('2023-08-07T12:30:00Z');

      expect(reviewsRequestedFromUser[0].reviewDueAt).toEqual(expectedDueTime);
      expect(reviewsRequestedFromUser[0].reviewDeadlineWarningAt).toEqual(
        expectedDeadlineWarningTime,
      );
    });
  });

  describe('createReviewRequest', () => {
    beforeAll(() => {
      const mockDate = new Date('2023-08-07T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    it('should create a review request with the correct requestedAt date', async () => {
      const createReviewRequestData = {
        pullRequestId: 123,
        reviewerId: 456,
      };

      const mockReviewRequestData = {
        id: 1,
        pullRequestId: 123,
        reviewerId: 456,
      };
      pullRequestRepository.createReviewRequest = jest
        .fn()
        .mockImplementation((reviewRequestData, requestedAt) => {
          return {
            ...reviewRequestData,
            id: mockReviewRequestData.id,
            requestedAt,
          };
        });

      const createdReviewRequest = await pullRequestService.createReviewRequest(
        createReviewRequestData,
      );

      expect(pullRequestRepository.createReviewRequest).toHaveBeenCalledWith(
        createReviewRequestData,
        new Date('2023-08-07T12:00:00Z'),
      );

      expect(createdReviewRequest).toEqual({
        ...mockReviewRequestData,
        requestedAt: new Date('2023-08-07T12:00:00Z'),
        dueAt: new Date('2023-08-07T13:00:00Z'),
        deadlineWarningAt: new Date('2023-08-07T12:30:00Z'),
      });
    });
  });
});

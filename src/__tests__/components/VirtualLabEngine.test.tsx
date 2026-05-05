import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VirtualLabEngine from '../../components/labs/VirtualLabEngine';
import type { LabConfig } from '../../data/labs/labTypes';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const TEST_CONFIG: LabConfig = {
  id: 'test-lab',
  title: 'Simple Pendulum Lab',
  subject: 'physics',
  topic: 'waves-optics',
  difficulty: 'high-school',
  description: 'Investigate the period of a simple pendulum',
  learningObjectives: [
    'Understand how length affects period',
    'Apply the pendulum equation T = 2π√(L/g)',
  ],
  variables: [
    {
      id: 'length',
      name: 'Length',
      unit: 'm',
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      description: 'Pendulum length',
    },
  ],
  predictionPrompts: [
    {
      id: 'p1',
      question: 'What happens to the period when length increases?',
      type: 'multiple-choice',
      options: ['Period increases', 'Period decreases', 'No change'],
      correctAnswer: 'Period increases',
      explanation: 'T = 2π√(L/g), so longer length means longer period.',
    },
  ],
  analysisPrompts: [
    {
      id: 'a1',
      question: 'Describe the relationship between length and period.',
      type: 'text',
      rubric: 'Should mention square root relationship',
    },
  ],
  defaultVariables: { length: 1 },
  trialLimit: 1,
  timeEstimate: 10,
};

function DummySimulation({ variables, isRunning, onRecordData }: {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}) {
  return (
    <div data-testid="simulation">
      <span data-testid="sim-length">{variables.length}</span>
      <span data-testid="sim-running">{isRunning ? 'running' : 'paused'}</span>
      <button
        data-testid="record-btn"
        onClick={() => onRecordData(2 * Math.PI * Math.sqrt(variables.length / 9.8))}
      >
        Record
      </button>
    </div>
  );
}

describe('VirtualLabEngine', () => {
  it('renders the lab title and description', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('Simple Pendulum Lab')).toBeInTheDocument();
    expect(screen.getByText('Investigate the period of a simple pendulum')).toBeInTheDocument();
  });

  it('renders learning objectives', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('Understand how length affects period')).toBeInTheDocument();
    expect(screen.getByText('Apply the pendulum equation T = 2π√(L/g)')).toBeInTheDocument();
  });

  it('shows the subject badge', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('PHYSICS')).toBeInTheDocument();
  });

  it('starts in predict phase', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('Make Your Predictions')).toBeInTheDocument();
  });

  it('shows trial counter', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText(/Trial 1 of 1/)).toBeInTheDocument();
  });

  it('renders the reset button', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('Reset Lab')).toBeInTheDocument();
  });

  it('shows prediction prompt questions', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('What happens to the period when length increases?')).toBeInTheDocument();
  });

  it('shows prediction multiple-choice options', () => {
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} />);

    expect(screen.getByText('Period increases')).toBeInTheDocument();
    expect(screen.getByText('Period decreases')).toBeInTheDocument();
    expect(screen.getByText('No change')).toBeInTheDocument();
  });

  it('calls onComplete when lab is completed', async () => {
    const user = userEvent.setup({ delay: null });
    const onComplete = vi.fn();
    const renderSim = (props: any) => <DummySimulation {...props} />;
    render(<VirtualLabEngine config={TEST_CONFIG} renderSimulation={renderSim} onComplete={onComplete} />);

    // Phase: Predict - select an option
    await user.click(screen.getByText('Period increases'));

    // Click "Start Observation" to advance to observe phase
    await user.click(screen.getByText('Start Observation'));

    // Phase: Observe - we need to record 3 data points
    const recordBtns = screen.getAllByTestId('record-btn');
    for (let i = 0; i < 3; i++) {
      await user.click(recordBtns[0]);
    }

    // Click "Proceed to Analysis"
    await user.click(screen.getByText('Proceed to Analysis'));

    // Phase: Analyze - type answer
    const textareas = screen.getAllByRole('textbox');
    const analysisTextarea = textareas.find(ta => (ta as HTMLTextAreaElement).placeholder === 'Write your analysis here...');
    if (analysisTextarea) {
      await user.type(analysisTextarea, 'Period increases with the square root of length');
    }

    // Click submit/complete (has a 500ms delay in AnalysisPhase)
    const submitBtn = screen.getByText('Complete Lab');
    await user.click(submitBtn);

    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    const session = onComplete.mock.calls[0][0];
    expect(session.score).toBeGreaterThanOrEqual(0);
    expect(session.completedAt).toBeDefined();
  });
});

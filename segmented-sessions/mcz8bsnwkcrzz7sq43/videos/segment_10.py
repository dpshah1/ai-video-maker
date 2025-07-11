from manim import *

class GraphsAnimation(Scene):
    def construct(self):

        title = Text("Complete Graphs, Trees, and Hypercubes").scale(0.8)
        subtitle = Text("Exploring Graph Structures").scale(0.5).next_to(title, DOWN)

        complete_graph = Circle(radius=0.5, color=BLUE).shift(LEFT * 3)
        tree_shape = Polygon(ORIGIN, RIGHT, UP + RIGHT, UP + LEFT).shift(ORIGIN)
        hypercube = Square(side_length=1).shift(RIGHT * 3)

        complete_graph_label = Text("Complete Graph").next_to(complete_graph, DOWN)
        tree_label = Text("Tree").next_to(tree_shape, DOWN)
        hypercube_label = Text("Hypercube").next_to(hypercube, DOWN)

        self.play(Write(title), Write(subtitle))
        self.wait(0.5)
        self.play(Create(complete_graph), Write(complete_graph_label))
        self.wait(0.5)
        self.play(Create(tree_shape), Write(tree_label))
        self.wait(0.5)
        self.play(Create(hypercube), Write(hypercube_label))
        self.wait(0.5)

        self.wait(1.3)